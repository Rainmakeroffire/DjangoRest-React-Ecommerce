import React, { useState } from 'react';
import FavoritesScreen from '../screens/FavoritesScreen';
import ComparisonsScreen from '../screens/ComparisonsScreen';
import ReviewsScreen from "../screens/ReviewsScreen";

function ProfileTabs() {
  const [activeTab, setActiveTab] = useState('tab1');

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div>
      <ul className="nav nav-tabs center-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'tab1' ? 'active' : ''}`}
            onClick={() => handleTabClick('tab1')}
          >
            Favorites
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'tab2' ? 'active' : ''}`}
            onClick={() => handleTabClick('tab2')}
          >
            Comparisons
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'tab3' ? 'active' : ''}`}
            onClick={() => handleTabClick('tab3')}
          >
            Reviews
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === 'tab1' && <FavoritesScreen />}
        {activeTab === 'tab2' && <ComparisonsScreen />}
        {activeTab === 'tab3' && <ReviewsScreen />}
      </div>
    </div>
  );
}

export default ProfileTabs;
