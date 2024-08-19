import axios from "axios";
// import { dummyUsers } from "../sockets/users.js";
import connection from "../db/db.js";
// only when clicked on start chat with xyz, conversation is created, from then on, we get the created conversations data
export const createConversation = async (req, res) => {
  // if already exists, return
  // else create
  const { members } = req.body;
  // console.log(req.body, "members");
  let convoName = "";
  const sortedMembers = members.sort();
  sortedMembers.forEach((member) => {
    convoName += member + ",";
  });
  convoName = convoName.slice(0, -1);
  console.log(convoName, "convoName");
  connection.query(
    "SELECT * FROM conversations WHERE name = ?",
    [convoName],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error fetching conversations" });
      }
      if (result.length > 0) {
        console.log("Conversation already exists");
        return res.status(200).json({
          success: true,
          message: "conversation already exists",
          conversation_id: result[0].conversation_id,
        });
      }
      connection.query(
        "INSERT INTO conversations (name) VALUES (?)",
        [convoName],
        async (err, result) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ error: "Error creating conversation" });
          }
          const conversationId = result.insertId;
          let query =
            "INSERT INTO user_conversation (conversation_id, user_id) VALUES ";
          let queryValues = [];
          members.forEach((memberId) => {
            query += "(?, ?),";
            queryValues.push(conversationId, memberId);
          });
          query = query.slice(0, -1);
          connection.query(query, queryValues, (err, result) => {
            if (err) {
              console.log("Error inserting conversation users:", err.message);
              return res.status(500).json({
                success: false,
                message: "Error creating conversation",
              });
            }
            console.log("Conversation_Users inserted successfully!");
            return res.json({
              success: true,
              message: "Conversation created",
              conversation_id: conversationId,
            });
          });
        }
      );
    }
  );
};

export const getConversations = async (req, res) => {
  const { user_id } = req.query;
  const query =
    // with all
    `SELECT 
    u.user_id, 
    u.username, 
    u.picture, 
    uc.conversation_id,
(SELECT m1.content 
     FROM message m1 
     WHERE m1.conversation_id = uc.conversation_id 
     ORDER BY m1.message_id DESC 
     LIMIT 1) AS last_message_content,
     
     (SELECT m1.sender_id 
     FROM message m1 
     WHERE m1.conversation_id = uc.conversation_id 
     ORDER BY m1.message_id DESC 
     LIMIT 1) AS last_message_sender_id,
    (SELECT CASE 
                WHEN m1.sender_id = ? THEN m1.sent_at 
                ELSE m1.received_at
            END
     FROM message m1 
     WHERE m1.conversation_id = uc.conversation_id 
     ORDER BY m1.message_id ASC 
     LIMIT 1) AS first_message_time,
    (SELECT CASE 
                WHEN m2.sender_id = ? THEN m2.sent_at 
                ELSE m2.received_at 
            END
     FROM message m2 
     WHERE m2.conversation_id = uc.conversation_id 
     ORDER BY m2.message_id DESC 
     LIMIT 1) AS last_message_time
FROM 
    user u
JOIN 
    user_conversation uc ON u.user_id = uc.user_id
JOIN 
    (SELECT conversation_id
     FROM user_conversation
     WHERE user_id = ?) AS conv_ids 
ON 
    uc.conversation_id = conv_ids.conversation_id 
WHERE 
    u.user_id != ?
HAVING last_message_content IS NOT NULL
ORDER BY last_message_time DESC;
`;
  // without last message and time
  // `SELECT u.user_id, u.username, u.picture, uc.conversation_id
  //               FROM user u
  //               JOIN user_conversation uc ON u.user_id = uc.user_id
  //               JOIN (
  //                   SELECT conversation_id
  //                   FROM user_conversation
  //                   WHERE user_id = ?
  //               ) AS conv_ids ON uc.conversation_id = conv_ids.conversation_id where u.user_id != ?`;
  connection.query(
    query,
    [user_id, user_id, user_id, user_id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ success: false, message: "Error fetching conversations" });
      }
      console.log("fetched successfully!");
      // console.log(result);
      return res.status(200).json({
        success: true,
        message: "fetched successfully",
        conversations: result,
      });
    }
  );
};

export const getConversation = async (req, res) => {
  const { person1, person2 } = req.query;
  console.log(person1, person2, "person1, person2");
  const query = `SELECT person1.conversation_id
FROM 
    (SELECT uc.conversation_id 
     FROM user_conversation uc 
     WHERE user_id = ?) person1
JOIN
    (SELECT uc.conversation_id 
     FROM user_conversation uc 
     WHERE user_id = ?) person2
ON
    person1.conversation_id = person2.conversation_id`;

  connection.query(
    "SELECT * FROM user where user_id = ?",
    [person2],
    (person2err, person2result) => {
      if (person2err) {
        console.log(person2err);
        return res
          .status(500)
          .json({ success: false, message: "Error fetching conversation" });
      }
      console.log("fetched successfully!");
      // console.log(person2result);
      connection.query(query, [person1, person2], (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ success: false, message: "Error fetching conversation" });
        }
        if (result.length === 0) {
          console.log("No conversation found");
          return res.status(200).json({
            success: true,
            message: "No conversation found",
            conversation: {
              ...person2result[0],
              conversation_id: null,
            },
          });
        }
        // console.log("fetched convID successfully!", result);
        // console.log({
        //   ...person2result[0],
        //   conversation_id: result,
        // });
        return res.status(200).json({
          success: true,
          message: "fetched successfully",
          conversation: {
            ...person2result[0],
            conversation_id: result[0].conversation_id,
          },
        });
      });
    }
  );
};

export const getMessages = async (req, res) => {
  const { conversation_id } = req.query;
  const query = "SELECT * FROM message WHERE conversation_id = ?";
  connection.query(query, [conversation_id], (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Error fetching messages" });
    }
    console.log("fetched successfully!");
    // console.log(result);
    return res.status(200).json({
      success: true,
      message: "fetched successfully",
      messages: result,
    });
  });
};

export const postMessage = async (reqBody) => {
  const { sender_id, conversation_id, content, sent_at } = reqBody;
  const query =
    "INSERT INTO message (sender_id, conversation_id, content, sent_at) VALUES (?, ?, ?, ?)";
  connection.query(
    query,
    [sender_id, conversation_id, content, sent_at],
    (err, res) => {
      if (err) {
        console.log(err);
        return;
        // return res
        //   .status(500)
        //   .json({ success: false, message: "Error sending message" });
      }
      console.log("Message inserted successfully!");
      // return res.status(200).json({ success: true, message: "Message sent" });
    }
  );
};

export const getUsers = async (req, res) => {
  const { search } = req.query;
  const query = "SELECT * FROM user WHERE username like ?";
  connection.query(query, [`%${search}%`], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error fetching users" });
    }
    console.log("fetched successfully!");
    console.log(result);
    return res.json({
      success: true,
      message: "fetched users successfully",
      users: result,
    });
  });

  // return res.json({ message: 'Conversation created' });
};

export const translateText = async (req, res) => {
  const { text, target } = req.body;
  const options = {
    method: "POST",
    url: "https://google-translate113.p.rapidapi.com/api/v1/translator/json",
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "google-translate113.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      from: "auto",
      to: target,
      json: {
        message: text,
      },
    },
  };
  try {
    const response = await axios.request(options);
    return res.json({
      status: "success",
      message: "translated successfully",
      translatedText: response.data.trans.message,
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
