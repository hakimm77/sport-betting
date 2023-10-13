export interface IReceivedData {
  bet_name: string; //
  bet_points: number | null;
  bet_price: number;
  bet_type: string;
  game_id: string; //
  id: string; //
  is_live: boolean; //
  is_main: boolean;
  league: string; //
  player_id: string;
  selection: string;
  selection_line: string;
  selection_poins: number | null;
  sport: string; //
  sportsbook: string; //
  timestamp: string;
}
