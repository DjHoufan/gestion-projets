import { GetUserCookies } from '@/core/hooks/use-get-user-cookies';
import RapportBody from '@/core/view/rapports/rapport-body'

const Rapport = async () => {
    const permission = await GetUserCookies();
  
  return  <RapportBody permission={permission} />
}

export default Rapport