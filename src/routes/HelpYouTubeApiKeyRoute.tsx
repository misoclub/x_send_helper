import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'

const PAGES_REFERRER = 'https://<github-username>.github.io/x_send_helper/*'
const LOCAL_REFERRER = 'http://localhost:5173/*'

export function HelpYouTubeApiKeyRoute() {
  return (
    <article className="space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/settings" className="btn-ghost h-9 w-9 p-0" aria-label="戻る">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">YouTube APIキーの発行手順</h1>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400">
        本ツールは YouTube Data API v3 を使ってチャンネルの公開動画一覧を取得します。
        APIキーはご自身の Google アカウントで発行し、本アプリの「設定」画面に貼り付けてください。
        無料のクォータ（10,000 unit/日）内で十分に使えます。
      </p>

      <Section number={1} title="Google アカウントで Google Cloud Console を開く">
        <p>
          以下を新しいタブで開いてください。Google アカウントへのログインが必要です。
        </p>
        <ExternalA href="https://console.cloud.google.com/">
          https://console.cloud.google.com/
        </ExternalA>
        <p className="text-xs text-slate-500">
          初めて使う場合は利用規約への同意が表示されます。請求先情報の登録は不要です（無料枠で完結します）。
        </p>
      </Section>

      <Section number={2} title="プロジェクトを作成（または選択）">
        <ol className="ml-5 list-decimal space-y-1.5">
          <li>画面上部のプロジェクト選択メニューを開く</li>
          <li>
            「新しいプロジェクト」を押し、プロジェクト名（例: <Code>x-send-helper</Code>）を入力して作成
          </li>
          <li>作成後、上部のメニューでそのプロジェクトが選択されていることを確認</li>
        </ol>
      </Section>

      <Section number={3} title="YouTube Data API v3 を有効化">
        <ol className="ml-5 list-decimal space-y-1.5">
          <li>左メニュー → 「APIとサービス」 → 「ライブラリ」</li>
          <li>
            検索欄に <Code>YouTube Data API v3</Code> と入力
          </li>
          <li>カード（鏡餅のような赤いアイコン）をクリックして「有効にする」</li>
        </ol>
        <div className="text-xs text-slate-500">
          直リンク:
          <ExternalA href="https://console.cloud.google.com/apis/library/youtube.googleapis.com">
            APIライブラリ (YouTube Data API v3)
          </ExternalA>
        </div>
      </Section>

      <Section number={4} title="APIキーを作成">
        <ol className="ml-5 list-decimal space-y-1.5">
          <li>左メニュー → 「APIとサービス」 → 「認証情報」</li>
          <li>上部の「+ 認証情報を作成」 → 「APIキー」</li>
          <li>
            「APIキーが作成されました」ダイアログが出るので、表示されているキー（
            <Code>AIza…</Code> で始まる文字列）を一旦コピー
          </li>
          <li>そのまま「キーを制限」を押す（→ 次のステップで制限を設定）</li>
        </ol>
      </Section>

      <Section number={5} title="HTTPリファラ制限を設定（重要）">
        <p>
          パブリックなWebサイトに置く都合上、APIキーには <strong>必ず</strong> 利用元URLの制限を入れてください。
          これがないと第三者にキーを抜かれた場合に勝手に使われ得ます（リファラ制限があれば実害は出ません）。
        </p>
        <ol className="ml-5 list-decimal space-y-1.5">
          <li>キーの編集画面で「アプリケーションの制限」 → 「ウェブサイト」を選択</li>
          <li>「+ 追加」を押し、以下の2つを順に登録</li>
        </ol>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            ローカル動作確認用: <Code>{LOCAL_REFERRER}</Code>
          </li>
          <li>
            GitHub Pages 公開用: <Code>{PAGES_REFERRER}</Code>
            <div className="mt-1 text-xs text-slate-500">
              <code>&lt;github-username&gt;</code> を自分の GitHub ユーザー名に置き換えること。
              リポジトリ名を <code>x_send_helper</code> 以外で運用している場合はその名前に合わせる。
            </div>
          </li>
        </ul>
        <p className="text-xs text-slate-500">
          末尾の <Code>/*</Code> はパス配下すべてを許可する意味です。書き忘れるとアクセスが弾かれます。
        </p>
      </Section>

      <Section number={6} title="API制限を YouTube Data API v3 のみに絞る">
        <ol className="ml-5 list-decimal space-y-1.5">
          <li>同じキーの編集画面で「APIの制限」 → 「キーを制限」を選択</li>
          <li>
            プルダウンから <Code>YouTube Data API v3</Code> だけにチェックを入れて保存
          </li>
        </ol>
        <p className="text-xs text-slate-500">
          こうしておくとキーが漏れても他のGoogle APIには使われません。
        </p>
      </Section>

      <Section number={7} title="本ツールにAPIキーを貼り付ける">
        <ol className="ml-5 list-decimal space-y-1.5">
          <li>
            <Link to="/settings" className="text-brand underline">
              設定画面
            </Link>
            の「YouTube APIキー」欄にコピーしたキーを貼り付け
          </li>
          <li>
            「登録チャンネル」欄に自分のチャンネルを追加（
            <Code>@handle</Code> / <Code>UCxxxx…</Code> 形式の ID / チャンネルURL のいずれでもOK）
          </li>
          <li>ホームに戻り、YouTube動画告知 → 動画一覧が表示されれば成功</li>
        </ol>
      </Section>

      <Section number={0} title="トラブルシュート">
        <Trouble
          title="403 forbidden / API_KEY_HTTP_REFERRER_BLOCKED"
        >
          ステップ5のリファラ制限に、いま開いているURLが含まれているか確認。
          末尾の <Code>/*</Code> 忘れがよくある原因。GitHub Pages のURL
          (<Code>https://&lt;user&gt;.github.io/x_send_helper/*</Code>) を追加し忘れていないかも要確認。
        </Trouble>
        <Trouble title="quotaExceeded">
          無料枠の 10,000 unit/日 を使い切ったケース。本ツールは
          <Code>playlistItems.list</Code> (1 unit/呼び出し) しか使わないため、
          通常用途で枯渇することはほぼありません。「更新」ボタンを連打した場合などに発生し、
          太平洋時間の0時にリセットされます。
        </Trouble>
        <Trouble title="チャンネルが見つかりませんでした">
          <Code>@handle</Code> 形式の場合は半角@であることを確認。
          チャンネルIDは <Code>UC</Code> で始まる24文字のID。
          URLを貼る場合は <Code>https://www.youtube.com/@yourhandle</Code> もしくは
          <Code>https://www.youtube.com/channel/UC…</Code> 形式が確実。
        </Trouble>
        <Trouble title="APIキーが画面に出てしまうのが不安">
          APIキーは <strong>この端末のブラウザのlocalStorage</strong> にのみ保存され、
          サーバーには送信されません。リファラ制限を入れている限り、仮にキーが他人に渡っても
          そのキーは登録されたドメインからしか有効になりません。
          共有PCで使う場合は使い終わったあとに設定画面でキーを空にしてください。
        </Trouble>
      </Section>
    </article>
  )
}

function Section({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="card space-y-3 p-4">
      <h2 className="flex items-center gap-2 text-base font-semibold">
        {number > 0 ? (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
            {number}
          </span>
        ) : null}
        {title}
      </h2>
      <div className="space-y-2 text-sm leading-relaxed">{children}</div>
    </section>
  )
}

function ExternalA({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 break-all text-brand underline"
    >
      {children}
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800">
      {children}
    </code>
  )
}

function Trouble({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <details className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-800">
      <summary className="cursor-pointer font-medium">{title}</summary>
      <div className="mt-2 space-y-2 text-slate-600 dark:text-slate-300">
        {children}
      </div>
    </details>
  )
}
