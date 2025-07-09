export type ItemNotSelectedProps = {
  title: string
  description: string
}

export function ItemNotSelected({ title, description }: ItemNotSelectedProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-muted-foreground mt-2">{description}</p>
    </div>
  )
}
