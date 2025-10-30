import { UserProfile } from "@clerk/nextjs";
import React from "react";

const page = () => {
  return (
    <div className="w-full z-40">
      <UserProfile
        appearance={{
          elements: {
            avatarBox: {
              display: "none",
            },

            profileSection__profile: {
              display: "none",
            },
          },
        }}
      />
    </div>
  );
};

export default page;
