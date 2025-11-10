import { createFileRoute } from '@tanstack/react-router'

// @ts-ignore: pathname route is being weird
export const Route = createFileRoute('/rooms/$roomId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/rooms/$roomId"!</div>
}
