import logo from '../BibleTrack_cropped.png';
import logoDark from '../BibleTrack_cropped_dark.png';
import { themeConfig } from './themeConfig';

const themes = {
    orange: {
        ...themeConfig.orange,
        logo: logo
    },
    blue: {
        ...themeConfig.blue,
        logo: logo
    },
    dark: {
        ...themeConfig.dark,
        logo: logoDark
    }
};

export { themes }; 