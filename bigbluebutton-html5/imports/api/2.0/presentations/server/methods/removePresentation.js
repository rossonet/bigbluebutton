import RedisPubSub from '/imports/startup/server/redis2x';
import { check } from 'meteor/check';
import Presentations from '/imports/api/2.0/presentations';

export default function removePresentation(credentials, presentationId) {
  const REDIS_CONFIG = Meteor.settings.redis;
  const CHANNEL = REDIS_CONFIG.channels.toAkkaApps;
  const EVENT_NAME = 'RemovePresentationPubMsg';

  const { meetingId, requesterUserId } = credentials;

  check(meetingId, String);
  check(requesterUserId, String);
  check(presentationId, String);

  const presenationToDelete = Presentations.findOne({
    meetingId,
    id: presentationId,
  });

  if (presenationToDelete.name === 'default.pdf') {
    throw new Meteor.Error('not-allowed', 'You are not allowed to remove the default slide');
  }

  if (presenationToDelete.current) {
    throw new Meteor.Error('not-allowed', 'You are not allowed to remove the current presentation');
  }

  const payload = {
    presentationId,
  };

  const header = {
    meetingId,
    name: EVENT_NAME,
    userId: requesterUserId,
  };

  return RedisPubSub.publish(CHANNEL, EVENT_NAME, meetingId, payload, header);
}
