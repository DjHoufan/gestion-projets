import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";
import { ProjectBody } from "@/core/view/projet/project-body";

 
const Projets = async() => {
    const permission = await GetUserCookies();
  
  return (
    <div className="p-6 space-y-6 max-w-full">
      <ProjectBody permission={permission} />;
    </div>
  );
};

export default Projets;
