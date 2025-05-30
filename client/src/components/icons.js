import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faStar,
    faStarHalfAlt,
    faClock,
    faSearch,
    faPlateWheat,
    faBowlFood,
    faUtensils,
    faCookieBite,  // corrected here!
    faHeart,
    faCog,
    faBowlRice,
    faSignOutAlt,
    faUser
} from '@fortawesome/free-solid-svg-icons';

import {
    faStar as farStar,
    faHeart as farHeart
} from '@fortawesome/free-regular-svg-icons';

// Register icons to the Font Awesome library
library.add(
    faStar,
    faStarHalfAlt,
    faPlateWheat,
    farStar,
    faBowlFood,
    faBowlRice,
    faClock,
    faSearch,
    faUtensils,
    faCookieBite,   // added here too!
    faHeart,
    farHeart,
    faCog,
    faSignOutAlt,
    faUser
);
