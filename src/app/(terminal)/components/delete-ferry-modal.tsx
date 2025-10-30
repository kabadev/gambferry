"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteFerryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ferryName: string
  onConfirm: () => void
}

export function DeleteFerryModal({ open, onOpenChange, ferryName, onConfirm }: DeleteFerryModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Ferry</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete ferry <span className="font-semibold">{ferryName}</span>? This action cannot
            be undone and will affect all associated schedules.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
