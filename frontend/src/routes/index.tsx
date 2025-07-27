import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from 'components/common/Layout/Layout';
import { Home } from 'pages/Home/Home';
import { TurtlePage } from 'pages/Solution1/TurtlePage';
import { SquirrelPage } from 'pages/Solution2/SquirrelPage';
import { Solution3 } from 'pages/Solution3/Solution3';
import { Solution4 } from 'pages/Solution4/Solution4';
import { Solution5 } from 'pages/Solution5/Solution5';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="solution-1" element={<TurtlePage />} />
          <Route path="solution-2" element={<SquirrelPage />} />
          <Route path="solution-3" element={<Solution3 />} />
          <Route path="solution-4" element={<Solution4 />} />
          <Route path="solution-5" element={<Solution5 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};