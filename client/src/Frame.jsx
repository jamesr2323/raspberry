import React, { useState, useEffect } from 'react'
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import { Body, Bottom, Main, Buttons, Button } from './FrameStyled.jsx'

import Player from './Player.jsx'

export default function Frame() {
  return <Body>
    <BrowserRouter>
      <Main>
        <Routes>
          <Route path="/" element={<Player />} />
        </Routes>
      </Main>
    </BrowserRouter>
  </Body>
}