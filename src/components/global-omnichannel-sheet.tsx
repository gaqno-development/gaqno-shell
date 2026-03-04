import React, { Suspense } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@gaqno-development/frontcore/components/ui";
import { useOmnichannelDrawer } from "@gaqno-development/frontcore/hooks";
import { lazyWithTimeout } from "@/lib/lazyWithTimeout";

// @ts-nocheck
const OmnichannelChatView = lazyWithTimeout(() => import("omnichannel/InboxView" as string));

export function GlobalOmnichannelSheet() {
  const { isOpen, setOpen, conversationId, customerId } = useOmnichannelDrawer();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col h-full">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Chat Omnicanal</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-hidden">
          <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Carregando Chat...</div>}>
            <OmnichannelChatView 
              conversationId={conversationId} 
              customerId={customerId}
              embedded
            />
          </Suspense>
        </div>
      </SheetContent>
    </Sheet>
  );
}
