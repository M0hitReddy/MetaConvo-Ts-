import Express from 'express';
import cookieParser from 'cookie-parser';
import { getMessages, postMessage, createConversation, getConversations, getConversation, getUsers,  translateText} from '../controllers/chats.js';
Express().use(cookieParser())
const chatsRouter = Express.Router();
// dotenv.googleConfig();
// chatsRouter.get('/chats', getChats)
chatsRouter.get('/messages', getMessages);
chatsRouter.get('/users', getUsers);

chatsRouter.post('/message', postMessage);
chatsRouter.post('/conversation', createConversation);
chatsRouter.post('/translate', translateText);
chatsRouter.get('/conversations', getConversations);
chatsRouter.get('/conversation', getConversation);

// chatsRouter.post('/logout', logout);

export default chatsRouter;