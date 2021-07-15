import { useEffect } from 'react';
import { useState } from 'react';
import { useInterval } from '../hooks/use-interval';
import { secondsToTime } from '../utils/seconds-to-time';
import { Button } from './button';
import { Timer } from './timer';

interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}
export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.pomodoroTime);
  const [timeCount, setTimeCount] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [cyclesQtd, setCyclesQtd] = useState(
    new Array(props.cycles - 1).fill(true),
  );

  const [completedCycles, setCompletedCycles] = useState(0);
  const [fullWorkingTime, setFullWorkingTime] = useState(0);
  const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
      if (working) setFullWorkingTime(fullWorkingTime + 1);
    },
    timeCount ? 1000 : null,
  );

  const playWork = () => {
    const audio = document.querySelector('audio#start') as HTMLAudioElement;
    if (audio) audio.play();
  };

  const stopWork = () => {
    const audio = document.querySelector('audio#stop') as HTMLAudioElement;
    if (audio) audio.play();
  };
  const configureWork = () => {
    setTimeCount(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.pomodoroTime);
    playWork();
  };

  const configureRest = (long: boolean) => {
    setTimeCount(true);
    setWorking(false);
    setResting(true);
    stopWork();

    long ? setMainTime(props.longRestTime) : setMainTime(props.shortRestTime);
  };

  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');

    if (mainTime > 0) return;
    if (working && cyclesQtd.length > 0) {
      configureRest(false);
      cyclesQtd.pop();
    } else if (working && cyclesQtd.length <= 0) {
      configureRest(true);
      setCyclesQtd(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if (working) setNumberOfPomodoros(numberOfPomodoros + 1);
    if (resting) configureWork();
  }, [
    working,
    resting,
    mainTime,
    cyclesQtd,
    numberOfPomodoros,
    completedCycles,
    props.cycles,
  ]);

  return (
    <div className="pomodoro">
      <h2>Você está: {working ? 'Trabalhando' : 'Descansando'}</h2>
      <Timer mainTime={mainTime} />
      <div className="controls">
        <Button text="Work" onClick={() => configureWork()} />
        <Button text="Rest" onClick={() => configureRest(false)} />
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text={timeCount ? 'Pause' : 'Play'}
          onClick={() => setTimeCount(!timeCount)}
        />
      </div>

      <div className="details">
        <p>Ciclos concluídos: {completedCycles}</p>
        <p>Horas trabalhadas: {secondsToTime(fullWorkingTime)}</p>
        <p>Pomodoros concluídos: {numberOfPomodoros}</p>
      </div>
    </div>
  );
}
