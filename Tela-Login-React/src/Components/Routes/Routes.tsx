import { createBrowserRouter } from "react-router-dom";
import { BoasVindas } from "../BoasVindas/BoasVindas";
import { TelaLogin } from "../TelaLogin/TelaLogin";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <TelaLogin />,
    },
    {
        path : "/welcome",
        element: <BoasVindas />
    }
]);