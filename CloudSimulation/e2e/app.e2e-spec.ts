import { CloudSimulationPage } from './app.po';

describe('cloud-simulation App', function() {
  let page: CloudSimulationPage;

  beforeEach(() => {
    page = new CloudSimulationPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
