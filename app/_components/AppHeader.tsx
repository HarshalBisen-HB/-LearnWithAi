import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation"; // Changed from 'next/router'
import React from "react";

function AppHeader() {
  const router = useRouter();

  const handleSignOut = () => {
    // Add any sign out logic here (clear tokens, etc.)
    router.push("/");
  };

  return (
    <div className="p-4 shadow-sm flex items-center justify-between w-full ">
      <SidebarTrigger />
      <Button
        onClick={handleSignOut}
        className="px-4 py-2 text-white hover:text-white font-medium transition-colors"
      >
        BACK
      </Button>
    </div>
  );
}

export default AppHeader;
