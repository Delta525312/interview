import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from 'components/common/Layout/Layout';
import {AlgorithmTestHome} from 'pages/Home/Home';
import { TurtlePage } from 'pages/Solution1/TurtlePage';
import { SquirrelPage } from 'pages/Solution2/SquirrelPage';
import { URLshortenPage } from 'pages/Solution3/URLshortenPage';
import { Ratelimit} from 'pages/Solution4/Ratelimit';
import { Solution5 } from 'pages/Solution5/Solution5';
import { NotFound } from 'pages/NotFound';
import { ScrollToTop } from 'components/common/loading/ScrollToTop';
import { ErrorBoundary } from 'components/common/ErrorBoundary/ErrorBoundary';
export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<AlgorithmTestHome />} />
            <Route path="solution-1" element={<TurtlePage />} />
            <Route path="solution-2" element={<SquirrelPage />} />
            <Route path="solution-3" element={<URLshortenPage />} />
            <Route path="solution-4" element={<Ratelimit />} />
            <Route path="solution-5" element={<Solution5 />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};