import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import AddStoryPage from '../pages/add/add-story-page';
import StoryDetailPage from '../pages/story-detail/story-detail-page';
import BookmarkPage from '../pages/bookmark/bookmark-page';
import NotFoundPage from '../pages/not-found/not-found-page';
import ScreenshotsPage from '../pages/screenshots/screenshots-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/add-story': new AddStoryPage(),
  '/story/:id': new StoryDetailPage(),
  '/bookmark': new BookmarkPage(),
  '/screenshots': new ScreenshotsPage(),
  '*': new NotFoundPage(),
};

export default routes;
