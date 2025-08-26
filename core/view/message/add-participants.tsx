"use client";

import SearchSelect from "@/core/components/global/search_select";
import { Button } from "@/core/components/ui/button";
import { useAddParticipants } from "@/core/hooks/use-chat";
import { useGetUsersNotInChat } from "@/core/hooks/use-teams";
import { IdType } from "@/core/lib/types";
import { Users } from "lucide-react";
import { useState } from "react";

export const AddParticipants = ({ Id }: IdType) => {
  const { data, isPending } = useGetUsersNotInChat(Id);
  const [id, setId] = useState<string>("");
  const { mutate: addParticipant, isPending: loading } = useAddParticipants();

  return (
    <div className="p-5 space-y-5">
      <SearchSelect
        className="w-full"
        Icon={Users}
        items={data ? data : []}
        onChangeValue={(value) => setId(value)}
        loading={isPending}
        selectedId={id}
        disabled={loading}
      />

      <Button
        onClick={() =>
          addParticipant({
            param: {
              chatId: Id,
              userId: id,
            },
          })
        }
      >
        Ajouter l'utilisateur sélectionné
      </Button>
    </div>
  );
};
