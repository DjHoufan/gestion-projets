import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";
import MessageBody from "@/core/view/message/message-body";
 
 
const Messages = async () => {
  const currentUser = await GetUserCookies();

  return <MessageBody userId={currentUser.id} type={currentUser.type} />;
};

export default Messages;
