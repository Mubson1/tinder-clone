import React, { createContext, useContext, useEffect, useState } from "react";
import * as Google from "expo-google-app-auth";
// import {
//   GoogleAuthProvider,
//   signInWithCredential,
//   onAuthStateChanged,
//   signOut,
// } from "firebase/compat/auth";
import firebase from "firebase/compat/app";
import { auth } from "../../firebase";

const AuthContext = createContext({
  //initial state is empty
});

const config = {
  androidClientId:
    "324364935748-19snsouot6b6vq07bs9i8ai09a26i810.apps.googleusercontent.com",
  iosClientId:
    "324364935748-j7utiq3ikuti0481fbbe4imktl7if09n.apps.googleusercontent.com",
  scopes: ["profile", "email"],
  permissions: ["public_profile", "email", "gender", "location"],
};

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoadingInitial(false);
    });
    return unsub;
  }, []);

  const logout = () => {
    setLoading(true);
    auth
      .signOut(auth)
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    await Google.logInAsync(config)
      .then(async (logInResult) => {
        if (logInResult.type === "success") {
          const { idToken, accessToken } = logInResult;
          const credential = firebase.auth.GoogleAuthProvider.credential(
            idToken,
            accessToken
          );
          //in above we have got credentials from google. Now, we will be adding details from google to firebase using signInWithCredential
          await auth.signInWithCredential(credential);
        }
        return Promise.reject();
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
    // try {
    //   //await GoogleSignIn.askForPlayServicesAsync();
    //   const result = await Google.logInAsync(config);
    //   if (result.type === "success") {
    //     console.log(result);
    //     const credential = firebase.auth.GoogleAuthProvider.credential(
    //       //Set the tokens to Firebase
    //       result.idToken,
    //       result.accessToken
    //     );
    //     auth
    //       .signInWithCredential(auth, credential) //Login to Firebase
    //       .catch((error) => {
    //         console.log(error);
    //       });
    //   } else {
    //     //CANCEL
    //   }
    // } catch ({ message }) {
    //   alert("login: Error:" + message);
    // }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, signInWithGoogle, logout }}
    >
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
