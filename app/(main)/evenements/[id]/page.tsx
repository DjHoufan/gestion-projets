import { IdProps } from "@/core/lib/types";

const Evenement = async ({ params }: IdProps) => {
  const { Id } = await params;

  return <h2>Événement {Id} - </h2>;
};

export default Evenement;
