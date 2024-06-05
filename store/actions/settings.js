import { HAS_SEEN_LOGIN_LAUNCHSCREEN, IS_IN_LAUNCH_FLOW } from './constants';

export function hasSeenLaunchLoginScreen(value = false) {
  return {
    type: HAS_SEEN_LOGIN_LAUNCHSCREEN,
    value,
  };
}

export function setIsInLaunchFlow(value = true) {
  return {
    type: IS_IN_LAUNCH_FLOW,
    value,
  };
}
