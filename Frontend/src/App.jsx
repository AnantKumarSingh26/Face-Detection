import {RouterProvider} from "react-router";
import {router} from "./app.routes";
import '../src/features/shared/styles/global.scss'
import { AuthProvider } from "./features/auth/auth.context";

function App() {

  return (
    <AuthProvider>

      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
