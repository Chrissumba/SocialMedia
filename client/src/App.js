import React from "react";
import Home from "./pages/home/Home";
import {
    createBrowserRouter,
    Route,
    createRoutesFromElements,
    RouterProvider,
} from "react-router-dom";

// create Router,route
const myRouter = createBrowserRouter(
    createRoutesFromElements(
       < Route >
       
       <Route path = "/"
        element = { < Home / > }
        />  
        </Route>
    )
);
const App = () => {
    return <RouterProvider router = { myRouter }
    />;
};

export default App;