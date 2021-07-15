import { secondsToMinutes } from '../utils/seconds-to-minutes';

type Props = {
  mainTime: number;
};

export function Timer(props: Props): JSX.Element {
  return <div className="timer">{secondsToMinutes(props.mainTime)}</div>;
}
