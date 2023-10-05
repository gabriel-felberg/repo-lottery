import { LotteryProvider, IProviderProps } from "./Lottery";

const Providers = ({ children }: IProviderProps) => {
  return <LotteryProvider>{children}</LotteryProvider>;
};

export default Providers;