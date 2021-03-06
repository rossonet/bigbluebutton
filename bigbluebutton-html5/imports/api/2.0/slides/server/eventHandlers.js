import RedisPubSub from '/imports/startup/server/redis2x';
import handleSlideResize from './handlers/slideResize';
import handleSlideChange from './handlers/slideChange';

RedisPubSub.on('ResizeAndMovePageEvtMsg', handleSlideResize);
RedisPubSub.on('SetCurrentPageEvtMsg', handleSlideChange);
RedisPubSub.on('PresentationConversionUpdateEvtMsg', (...args) => console.error(args));
RedisPubSub.on('PresentationPageGeneratedEvtMsg', (...args) => console.error(args));
