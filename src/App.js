import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Mixes from "./pages/Mixes";
import MixPage from "./pages/MixPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Mixes />,
	},
	{
		path: "/mix",
		element: <MixPage />,
	},
]);

function App() {
	return (
		<div className="App">
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
