"use client"

import { useEffect, useId, useRef, type ReactNode } from "react"
import { X } from "lucide-react"
import { cn } from "../../../lib/utils"

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

/** Moves focus into the dialog, keeps Tab inside it, and restores focus on close. */
function useFocusTrap(ref: React.RefObject<HTMLElement>, active: boolean, restoreTo?: () => HTMLElement | null) {
  useEffect(() => {
    if (!active) return
    const node = ref.current
    if (!node) return
    const previous = document.activeElement as HTMLElement | null
    const first = node.querySelector<HTMLElement>("[data-autofocus]") ?? node.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus({ preventScroll: true })
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null)
      if (items.length === 0) return
      const firstItem = items[0]
      const lastItem = items[items.length - 1]
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault()
        lastItem.focus()
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault()
        firstItem.focus()
      }
    }
    node.addEventListener("keydown", onKeyDown)
    return () => {
      node.removeEventListener("keydown", onKeyDown)
      const target = restoreTo?.() ?? previous
      target?.focus({ preventScroll: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
}

interface DialogProps {
  label: string
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
  variant: "drawer" | "modal"
  restoreFocus?: () => HTMLElement | null
  wide?: boolean
  /** Changing this scrolls the body back to the top (e.g. Previous / Next project). */
  contentKey?: string
  /** A small action on the subtitle row, right-aligned under the close button. */
  headerAction?: ReactNode
}

export function Dialog({ label, title, subtitle, onClose, children, variant, restoreFocus, wide, contentKey, headerAction }: DialogProps) {
  const ref = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useFocusTrap(ref, true, restoreFocus)
  useEffect(() => {
    body.current?.scrollTo({ top: 0 })
  }, [contentKey])

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-40 flex",
        variant === "drawer" ? "items-end justify-end sm:items-stretch" : "items-end justify-center sm:items-center",
      )}
    >
      {variant === "modal" && (
        <div className="pointer-events-auto absolute inset-0 bg-[#0D1117]/70" onClick={onClose} aria-hidden="true" />
      )}
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "pointer-events-auto relative flex w-full flex-col border-border bg-card text-card-foreground shadow-2xl",
          variant === "drawer"
            ? "max-h-[82dvh] rounded-t-lg border-t sm:m-3 sm:mb-10 sm:max-h-none sm:w-[440px] sm:rounded-lg sm:border"
            : cn("max-h-[88dvh] rounded-t-lg border-t sm:max-h-[84dvh] sm:rounded-lg sm:border", wide ? "sm:max-w-5xl sm:mx-6" : "sm:max-w-lg sm:mx-6"),
        )}
      >
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-1 border-b border-border px-5 py-4 sm:px-6">
          <div className="min-w-0 space-y-1">
            <p className="section-label">{`// ${label}`}</p>
            <h2 id={titleId} className="font-display text-2xl leading-tight text-foreground sm:text-3xl">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-autofocus
            className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
          {(subtitle || headerAction) && (
            <div className="col-span-2 flex min-h-[1.25rem] items-center justify-between gap-3">
              {subtitle && <p className="font-mono text-xs text-muted-foreground">{subtitle}</p>}
              {headerAction && <div className="ml-auto flex-shrink-0">{headerAction}</div>}
            </div>
          )}
        </header>
        <div ref={body} className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          {children}
        </div>
      </div>
    </div>
  )
}
