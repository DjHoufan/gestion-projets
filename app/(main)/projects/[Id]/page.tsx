import { IdProps } from "@/core/lib/types";
import { ProjectDetail } from "@/core/view/projet/project-detail";

const Project = async ({ params }: IdProps) => {
  const { Id } = await params;

  return <ProjectDetail Id={Id} />;
};

export default Project;
