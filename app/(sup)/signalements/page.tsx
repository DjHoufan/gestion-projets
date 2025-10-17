import { GetUserCookies } from '@/core/hooks/use-get-user-cookies';
import SignalementsSup from '@/core/view/superiviseur/signalement-sup'


const Signalements = async () => {
    const user = await GetUserCookies();
  
  return  <SignalementsSup  id={user.id} />
}

export default Signalements