import { RouterProvider } from "react-router";
import { router } from "./router";
import MessageToast from "./component/MessageToast";

function App() {
  return (
    <>
      <MessageToast />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
