import { configureStore } from "@reduxjs/toolkit";
import authorizationSlice from "./slices/authorizationSlice";
import commentsSlice from "./slices/commentsSlice";
import postSlice from "./slices/postSlice";
import postsSlice from "./slices/postsSlice";
import shareSlice from "./slices/shareSlice";
import storiesSlice from "./slices/storiesSlice";

const store = configureStore({
    reducer: {
        auth: authorizationSlice,
        comments: commentsSlice,
        posts: postsSlice,
        share: shareSlice,
        stories: storiesSlice,
        post: postSlice
    },
});
export default store;