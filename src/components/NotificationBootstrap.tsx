import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { liveNotificationService } from '../services/liveNotificationService';

const NotificationBootstrap = () => {
  const profileToken = useSelector((state: RootState) => state.profile.token);
  const sampleToken = useSelector((state: RootState) => state.sample.token);
  const sessionProfile: any = useSelector((state: RootState) => state.profile.mobileCheck);

  const token = profileToken || sampleToken;
  const profileId = sessionProfile?.profile?.profileId;
  const checkedInPlace = sessionProfile?.profile?.currentLocation?.placeName;

  useEffect(() => {
    if (token && profileId) {
      liveNotificationService.start({
        token,
        profileId,
        checkedInPlace,
      });
    } else {
      liveNotificationService.stop();
    }

    return () => {
      liveNotificationService.stop();
    };
  }, [token, profileId, checkedInPlace]);

  return null;
};

export default NotificationBootstrap;
