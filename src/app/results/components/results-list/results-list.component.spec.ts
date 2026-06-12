import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ResultsListComponent } from './results-list.component';
import { Match } from '../../models/match.model';
import { describe, it, expect, beforeEach } from 'vitest';

describe('ResultsListComponent - KPI Computations', () => {
  let component: ResultsListComponent;
  let fixture: ComponentFixture<ResultsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('totalMatches computed signal', () => {
    it('should return 0 when no matches are set', () => {
      expect(component.totalMatches()).toBe(0);
    });

    it('should return the count of filtered matches', () => {
      const mockMatches: Match[] = [
        createMockMatch('1', 'Team A', 'Team B', '2', '1'),
        createMockMatch('2', 'Team C', 'Team D', '1', '1'),
        createMockMatch('3', 'Team E', 'Team F', '3', '0'),
      ];

      component['matches'].set(mockMatches);
      expect(component.totalMatches()).toBe(3);
    });

    it('should update totalMatches when search filters matches', () => {
      const mockMatches: Match[] = [
        createMockMatch('1', 'Manchester United', 'Liverpool', '2', '1'),
        createMockMatch('2', 'Arsenal', 'Chelsea', '1', '1'),
      ];

      component['matches'].set(mockMatches);
      expect(component.totalMatches()).toBe(2);

      // Filter to only matches with "Manchester"
      component['searchTerm'].set('Manchester');
      expect(component.totalMatches()).toBe(1);
    });
  });

  describe('totalGoals computed signal', () => {
    it('should return 0 when no matches are set', () => {
      expect(component.totalGoals()).toBe(0);
    });

    it('should sum all goals from home and away teams', () => {
      const mockMatches: Match[] = [
        createMockMatch('1', 'Team A', 'Team B', '2', '1'), // 3 goals
        createMockMatch('2', 'Team C', 'Team D', '1', '1'), // 2 goals
        createMockMatch('3', 'Team E', 'Team F', '3', '0'), // 3 goals
      ];

      component['matches'].set(mockMatches);
      expect(component.totalGoals()).toBe(8); // 3 + 2 + 3
    });

    it('should handle null/undefined scores as 0', () => {
      const mockMatches: Match[] = [
        createMockMatch('1', 'Team A', 'Team B', null, '2'),
        createMockMatch('2', 'Team C', 'Team D', '1', null),
      ];

      component['matches'].set(mockMatches);
      expect(component.totalGoals()).toBe(3); // 0 + 2 + 1 + 0
    });

    it('should update totalGoals when search filters matches', () => {
      const mockMatches: Match[] = [
        createMockMatch('1', 'Manchester United', 'Liverpool', '5', '2'), // 7 goals
        createMockMatch('2', 'Arsenal', 'Chelsea', '2', '1'), // 3 goals
      ];

      component['matches'].set(mockMatches);
      expect(component.totalGoals()).toBe(10);

      component['searchTerm'].set('Arsenal');
      expect(component.totalGoals()).toBe(3);
    });
  });

  describe('averageGoals computed signal', () => {
    it('should return "0.0" when no matches are set', () => {
      expect(component.averageGoals()).toBe('0.0');
    });

    it('should calculate average goals per match', () => {
      const mockMatches: Match[] = [
        createMockMatch('1', 'Team A', 'Team B', '2', '1'), // 3 goals
        createMockMatch('2', 'Team C', 'Team D', '1', '1'), // 2 goals
        createMockMatch('3', 'Team E', 'Team F', '0', '0'), // 0 goals
      ];

      component['matches'].set(mockMatches);
      // (3 + 2 + 0) / 3 = 1.666... → '1.7' (1 decimal place)
      expect(component.averageGoals()).toBe('1.7');
    });

    it('should format result to 1 decimal place', () => {
      const mockMatches: Match[] = [
        createMockMatch('1', 'Team A', 'Team B', '1', '0'), // 1 goal
        createMockMatch('2', 'Team C', 'Team D', '2', '2'), // 4 goals
      ];

      component['matches'].set(mockMatches);
      // (1 + 4) / 2 = 2.5
      expect(component.averageGoals()).toBe('2.5');
    });

    it('should update averageGoals when search filters matches', () => {
      const mockMatches: Match[] = [
        createMockMatch('1', 'Real Madrid', 'Barcelona', '3', '3'), // 6 goals, avg = 6
        createMockMatch('2', 'Sevilla', 'Valencia', '1', '1'), // 2 goals, avg = 1
      ];

      component['matches'].set(mockMatches);
      expect(component.averageGoals()).toBe('4.0');

      component['searchTerm'].set('Real');
      // Only Real Madrid match: 6 goals / 1 match = 6.0
      expect(component.averageGoals()).toBe('6.0');
    });

    it('should handle edge case with single match', () => {
      const mockMatches: Match[] = [createMockMatch('1', 'Team A', 'Team B', '2', '3')];

      component['matches'].set(mockMatches);
      // (2 + 3) / 1 = 5.0
      expect(component.averageGoals()).toBe('5.0');
    });
  });

  describe('KPI integration with search', () => {
    it('should update all KPIs together when search term changes', () => {
      const mockMatches: Match[] = [
        createMockMatch('1', 'Manchester City', 'Manchester United', '3', '1'), // 4 goals
        createMockMatch('2', 'Liverpool', 'Everton', '2', '0'), // 2 goals
        createMockMatch('3', 'Arsenal', 'Tottenham', '1', '2'), // 3 goals
      ];

      component['matches'].set(mockMatches);

      // Before search: all matches
      expect(component.totalMatches()).toBe(3);
      expect(component.totalGoals()).toBe(9);
      expect(component.averageGoals()).toBe('3.0');

      // Search for "Manchester"
      component['searchTerm'].set('Manchester');
      expect(component.totalMatches()).toBe(1);
      expect(component.totalGoals()).toBe(4);
      expect(component.averageGoals()).toBe('4.0');

      // Search for "Liverpool"
      component['searchTerm'].set('Liverpool');
      expect(component.totalMatches()).toBe(1);
      expect(component.totalGoals()).toBe(2);
      expect(component.averageGoals()).toBe('2.0');
    });
  });
});

/**
 * Helper function to create mock match data for testing
 */
function createMockMatch(
  id: string,
  homeTeam: string,
  awayTeam: string,
  homeScore: string | null,
  awayScore: string | null,
): Match {
  return {
    idEvent: id,
    idAPIfootball: null,
    strFilename: null,
    strEvent: `${homeTeam} vs ${awayTeam}`,
    strHomeTeam: homeTeam,
    strAwayTeam: awayTeam,
    intHomeScore: homeScore,
    intAwayScore: awayScore,
    dateEvent: '2026-06-12',
    strTime: '20:00',
    strVenue: 'Stadium',
    strLeague: 'Premier League',
    strLeagueBadge: null,
    strSeason: '2025-2026',
    strStatus: 'Final',
    strPostponed: 'no',
    strHomeTeamBadge: null,
    strAwayTeamBadge: null,
    strResult: null,
    strDescriptionEN: null,
    strBanner: null,
    strThumb: null,
    strPoster: null,
    strSquare: null,
    strFanart: null,
    strVideo: null,
    strTweet1: null,
    strMap: null,
    intRound: '1',
    intScore: null,
    intScoreVotes: null,
    idHomeTeam: '1',
    idAwayTeam: '2',
    idLeague: '133602',
    idVenue: null,
    strCity: 'City',
    strCountry: 'Country',
    intSpectators: '60000',
    strOfficial: 'Referee',
    strWeather: 'Clear',
    dateEventLocal: '2026-06-12',
    strTimeLocal: '20:00',
    strTimestamp: '2026-06-12T20:00:00Z',
    strEventAlternate: null,
    strSport: 'Football',
    strLocked: null,
  };
}
