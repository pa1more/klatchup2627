import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { pushNotificationService } from '../services/pushNotificationService';

const PushNotificationBootstrap = () => {
  const profileToken = useSelector((state: RootState) => state.profile.token);
  const sampleToken = useSelector((state: RootState) => state.sample.token);
  const sessionProfile: any = useSelector((state: RootState) => state.profile.mobileCheck);

  const token = profileToken || sampleToken;
  const profileId = sessionProfile?.profile?.profileId;

  useEffect(() => {
    if (!token || !profileId) {
      return;
    }

    pushNotificationService.registerDeviceToken(token).catch(() => null);
  }, [token, profileId]);

  return null;
};

export default PushNotificationBootstrap;
