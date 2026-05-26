import { PostTypePicker } from '@/components/compose/PostTypePicker'

export function HomeRoute() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">投稿タイプを切り替え</h1>
        <p className="text-sm text-slate-500">
          投稿の種類を選ぶと、その種類専用のテンプレートとフォームに切り替わります。
        </p>
      </div>
      <PostTypePicker />
    </div>
  )
}
