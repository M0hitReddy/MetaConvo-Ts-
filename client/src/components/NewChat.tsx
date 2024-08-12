import { useEffect, useState } from "react";
import { NewChatDialog } from "./NewChatDialog";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { MessageCirclePlus } from "lucide-react";
// import { Combobox } from "./ComboBox";
export function NewChat() {
  const [open, setOpen] = useState<boolean>(false);
  const[hovered, setHovered] = useState<boolean>(false);
  useEffect(() => {
    console.log("open", open);
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip open={hovered}>
        <TooltipTrigger asChild onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <MessageCirclePlus />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={5}>
          New Chat
        </TooltipContent>
      </Tooltip>
      <DialogContent className="p-0 mt-8 gap-0 outline-none min-h-[600px h-[86vh]">

      <Tabs
        defaultValue="newChat"
        className="relative max-w-full"
        onChange={() => console.log("done @@###")}
        >
        <TabsList className="grid w-full grid-cols-2 absolute z-50 -mt-12 ">
          <TabsTrigger value="newChat">New Chat</TabsTrigger>
          <TabsTrigger value="newGroup">New Group</TabsTrigger>
        </TabsList>

        <TabsContent value="newChat" className="m-0 h-full">
          <NewChatDialog target={{newChat: true}} open={open} setOpen={setOpen} />
        </TabsContent>
        <TabsContent value="newGroup" className="m-0 h-full">
          <NewChatDialog target={{newGroup: true}} open={open} setOpen={setOpen} />
        </TabsContent>
      </Tabs>
        </DialogContent>
    </Dialog>
  );
}
