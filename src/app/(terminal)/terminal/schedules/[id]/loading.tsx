import { Loader2 } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
};

export default loading;
