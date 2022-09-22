// client/src/App.js

import React, { useState, useEffect } from "react";
import logo from "./logo.svg"
import "./App.css"
import Frame from './Frame'

import { Provider } from 'react-redux'
import store from './store/store.js'

function App() {
  return <Frame />
}



export default App;