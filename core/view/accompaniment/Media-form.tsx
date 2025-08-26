import { UploadMultiFilesMinimal } from "@/core/components/global/multi-uploads";
import { Button } from "@/core/components/ui/button";
import { useAddMedia } from "@/core/hooks/use-accompaniment";
import React, { useState } from "react";

type Files = {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
};

type Props = {
  id: string;
};

const MediaForm = ({ id }: Props) => {
  const { mutate: create, isPending } = useAddMedia();
  const [FileItem, setfiles] = useState<Files[]>([]);

  const addMedia = () => {
 

    create(
      {
        json: {
          files: FileItem,
          id: id,
        },
      },
      {
        onSuccess: () => {
          setfiles([]);
        },
      }
    );
  };

  return (
    <div className="space-y-5 ">
      <h2 className="first-letter:text-primary  text-xl">
        Ajouter des nouvelles photos ou vidéos
      </h2>
      <UploadMultiFilesMinimal
        valuetab={[]}
        disabled={isPending}
        onChangeAction={(value) => {
          setfiles(value);
        }}
      />
      <div className="flex justify-end">
        <Button
          disabled={!FileItem.length || isPending}
          onClick={() => addMedia()}
        >
          Enregistre
        </Button>
      </div>
    </div>
  );
};

export default MediaForm;
