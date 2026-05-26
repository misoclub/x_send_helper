import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppHeader } from './components/layout/AppHeader'
import { ComposeRoute } from './routes/ComposeRoute'
import { SettingsRoute } from './routes/SettingsRoute'
import { HelpYouTubeApiKeyRoute } from './routes/HelpYouTubeApiKeyRoute'

export default function App() {
  return (
    <HashRouter>
      <div className="flex min-h-full flex-col">
        <AppHeader />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/compose/youtube" replace />}
            />
            <Route path="/compose/:postTypeId" element={<ComposeRoute />} />
            <Route path="/settings" element={<SettingsRoute />} />
            <Route
              path="/help/youtube-api-key"
              element={<HelpYouTubeApiKeyRoute />}
            />
            <Route
              path="*"
              element={<Navigate to="/compose/youtube" replace />}
            />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}
