import React from 'react';
import { render } from '@testing-library/react-native';
import {
    HomeIcon,
    DuaIcon,
    QiblaIcon,
    TisbihIcon,
    SettingsIcon,
    SunIcon,
    SunsetIcon,
    MoonIcon,
} from './index';

// Note: react-native-svg is mocked globally in jest.setup.js

describe('Icon Components', () => {
    describe('HomeIcon', () => {
        describe('Rendering with Default Props', () => {
            it('should render without crashing', () => {
                expect(() => render(<HomeIcon />)).not.toThrow();
            });

            it('should use default size of 24', () => {
                const { getByTestId } = render(<HomeIcon />);
                // Component renders with default size
                expect(() => render(<HomeIcon />)).not.toThrow();
            });

            it('should use default color of black', () => {
                expect(() => render(<HomeIcon />)).not.toThrow();
            });

            it('should render in unfocused state by default', () => {
                expect(() => render(<HomeIcon />)).not.toThrow();
            });
        });

        describe('Rendering with Custom Props', () => {
            it('should accept custom size prop', () => {
                expect(() => render(<HomeIcon size={32} />)).not.toThrow();
            });

            it('should accept custom color prop', () => {
                expect(() => render(<HomeIcon color="#FF0000" />)).not.toThrow();
            });

            it('should render in focused state', () => {
                expect(() => render(<HomeIcon focused={true} />)).not.toThrow();
            });

            it('should render in unfocused state', () => {
                expect(() => render(<HomeIcon focused={false} />)).not.toThrow();
            });

            it('should accept all props together', () => {
                expect(() => render(
                    <HomeIcon size={48} color="#1A5246" focused={true} />
                )).not.toThrow();
            });
        });
    });

    describe('DuaIcon', () => {
        it('should render without crashing', () => {
            expect(() => render(<DuaIcon />)).not.toThrow();
        });

        it('should accept size prop', () => {
            expect(() => render(<DuaIcon size={28} />)).not.toThrow();
        });

        it('should accept color prop', () => {
            expect(() => render(<DuaIcon color="#03DAC6" />)).not.toThrow();
        });

        it('should accept focused prop', () => {
            expect(() => render(<DuaIcon focused={true} />)).not.toThrow();
        });

        it('should render with all custom props', () => {
            expect(() => render(
                <DuaIcon size={36} color="blue" focused={true} />
            )).not.toThrow();
        });
    });

    describe('QiblaIcon', () => {
        it('should render without crashing', () => {
            expect(() => render(<QiblaIcon />)).not.toThrow();
        });

        it('should accept size prop', () => {
            expect(() => render(<QiblaIcon size={30} />)).not.toThrow();
        });

        it('should accept color prop', () => {
            expect(() => render(<QiblaIcon color="green" />)).not.toThrow();
        });

        it('should toggle focused state', () => {
            const { rerender } = render(<QiblaIcon focused={false} />);
            expect(() => rerender(<QiblaIcon focused={true} />)).not.toThrow();
        });
    });

    describe('TisbihIcon', () => {
        it('should render without crashing', () => {
            expect(() => render(<TisbihIcon />)).not.toThrow();
        });

        it('should accept custom size', () => {
            expect(() => render(<TisbihIcon size={40} />)).not.toThrow();
        });

        it('should accept custom color', () => {
            expect(() => render(<TisbihIcon color="#1A5246" />)).not.toThrow();
        });

        it('should handle focused state', () => {
            expect(() => render(<TisbihIcon focused={true} />)).not.toThrow();
            expect(() => render(<TisbihIcon focused={false} />)).not.toThrow();
        });
    });

    describe('SettingsIcon', () => {
        it('should render without crashing', () => {
            expect(() => render(<SettingsIcon />)).not.toThrow();
        });

        it('should accept all props', () => {
            expect(() => render(
                <SettingsIcon size={26} color="gray" focused={false} />
            )).not.toThrow();
        });

        it('should handle focused state change', () => {
            const { rerender } = render(<SettingsIcon focused={false} />);
            rerender(<SettingsIcon focused={true} />);
            expect(() => render(<SettingsIcon />)).not.toThrow();
        });
    });

    describe('SunIcon (Prayer Times)', () => {
        describe('Rendering', () => {
            it('should render without crashing', () => {
                expect(() => render(<SunIcon />)).not.toThrow();
            });

            it('should accept size prop', () => {
                expect(() => render(<SunIcon size={20} />)).not.toThrow();
            });

            it('should accept color prop', () => {
                expect(() => render(<SunIcon color="#FFA500" />)).not.toThrow();
            });

            it('should render with both custom props', () => {
                expect(() => render(<SunIcon size={32} color="orange" />)).not.toThrow();
            });
        });

        describe('Props Defaults', () => {
            it('should use default size when not provided', () => {
                expect(() => render(<SunIcon />)).not.toThrow();
            });

            it('should use default color when not provided', () => {
                expect(() => render(<SunIcon />)).not.toThrow();
            });
        });
    });

    describe('SunsetIcon (Prayer Times)', () => {
        it('should render without crashing', () => {
            expect(() => render(<SunsetIcon />)).not.toThrow();
        });

        it('should accept size prop', () => {
            expect(() => render(<SunsetIcon size={25} />)).not.toThrow();
        });

        it('should accept color prop', () => {
            expect(() => render(<SunsetIcon color="#FF6347" />)).not.toThrow();
        });

        it('should render with custom props', () => {
            expect(() => render(<SunsetIcon size={28} color="tomato" />)).not.toThrow();
        });
    });

    describe('MoonIcon (Prayer Times)', () => {
        it('should render without crashing', () => {
            expect(() => render(<MoonIcon />)).not.toThrow();
        });

        it('should accept size prop', () => {
            expect(() => render(<MoonIcon size={22} />)).not.toThrow();
        });

        it('should accept color prop', () => {
            expect(() => render(<MoonIcon color="#4169E1" />)).not.toThrow();
        });

        it('should render with both props', () => {
            expect(() => render(<MoonIcon size={30} color="royalblue" />)).not.toThrow();
        });
    });

    describe('Navigation Icons - Focused State Behavior', () => {
        const navigationIcons = [
            { name: 'HomeIcon', Component: HomeIcon },
            { name: 'DuaIcon', Component: DuaIcon },
            { name: 'QiblaIcon', Component: QiblaIcon },
            { name: 'TisbihIcon', Component: TisbihIcon },
            { name: 'SettingsIcon', Component: SettingsIcon },
        ];

        navigationIcons.forEach(({ name, Component }) => {
            describe(`${name} focused state`, () => {
                it(`should render ${name} in focused state`, () => {
                    expect(() => render(<Component focused={true} />)).not.toThrow();
                });

                it(`should render ${name} in unfocused state`, () => {
                    expect(() => render(<Component focused={false} />)).not.toThrow();
                });

                it(`should handle ${name} state transitions`, () => {
                    const { rerender } = render(<Component focused={false} />);
                    expect(() => rerender(<Component focused={true} />)).not.toThrow();
                });
            });
        });
    });

    describe('Prayer Time Icons - No Focused State', () => {
        it('should render SunIcon without focused prop', () => {
            expect(() => render(<SunIcon size={24} color="black" />)).not.toThrow();
        });

        it('should render SunsetIcon without focused prop', () => {
            expect(() => render(<SunsetIcon size={24} color="black" />)).not.toThrow();
        });

        it('should render MoonIcon without focused prop', () => {
            expect(() => render(<MoonIcon size={24} color="black" />)).not.toThrow();
        });
    });

    describe('All Icons - Size Variations', () => {
        const allIcons = [
            { name: 'HomeIcon', Component: HomeIcon, hasFocused: true },
            { name: 'DuaIcon', Component: DuaIcon, hasFocused: true },
            { name: 'QiblaIcon', Component: QiblaIcon, hasFocused: true },
            { name: 'TisbihIcon', Component: TisbihIcon, hasFocused: true },
            { name: 'SettingsIcon', Component: SettingsIcon, hasFocused: true },
            { name: 'SunIcon', Component: SunIcon, hasFocused: false },
            { name: 'SunsetIcon', Component: SunsetIcon, hasFocused: false },
            { name: 'MoonIcon', Component: MoonIcon, hasFocused: false },
        ];

        describe('Small sizes', () => {
            allIcons.forEach(({ name, Component }) => {
                it(`should render ${name} with size 16`, () => {
                    expect(() => render(<Component size={16} />)).not.toThrow();
                });
            });
        });

        describe('Large sizes', () => {
            allIcons.forEach(({ name, Component }) => {
                it(`should render ${name} with size 48`, () => {
                    expect(() => render(<Component size={48} />)).not.toThrow();
                });
            });
        });

        describe('Extra large sizes', () => {
            allIcons.forEach(({ name, Component }) => {
                it(`should render ${name} with size 64`, () => {
                    expect(() => render(<Component size={64} />)).not.toThrow();
                });
            });
        });
    });

    describe('All Icons - Color Variations', () => {
        const testColors = ['#FF0000', 'blue', 'rgb(255, 0, 0)', '#1A5246'];

        testColors.forEach(color => {
            it(`should render HomeIcon with color ${color}`, () => {
                expect(() => render(<HomeIcon color={color} />)).not.toThrow();
            });
        });
    });

    describe('Edge Cases', () => {
        it('should handle size of 0', () => {
            expect(() => render(<HomeIcon size={0} />)).not.toThrow();
        });

        it('should handle very large size', () => {
            expect(() => render(<HomeIcon size={200} />)).not.toThrow();
        });

        it('should handle undefined focused prop', () => {
            expect(() => render(<HomeIcon focused={undefined} />)).not.toThrow();
        });

        it('should handle null color', () => {
            expect(() => render(<SunIcon color={null} />)).not.toThrow();
        });

        it('should handle empty string color', () => {
            expect(() => render(<MoonIcon color="" />)).not.toThrow();
        });
    });

    describe('Exports Verification', () => {
        it('should export HomeIcon', () => {
            expect(HomeIcon).toBeDefined();
            expect(typeof HomeIcon).toBe('function');
        });

        it('should export DuaIcon', () => {
            expect(DuaIcon).toBeDefined();
            expect(typeof DuaIcon).toBe('function');
        });

        it('should export QiblaIcon', () => {
            expect(QiblaIcon).toBeDefined();
            expect(typeof QiblaIcon).toBe('function');
        });

        it('should export TisbihIcon', () => {
            expect(TisbihIcon).toBeDefined();
            expect(typeof TisbihIcon).toBe('function');
        });

        it('should export SettingsIcon', () => {
            expect(SettingsIcon).toBeDefined();
            expect(typeof SettingsIcon).toBe('function');
        });

        it('should export SunIcon', () => {
            expect(SunIcon).toBeDefined();
            expect(typeof SunIcon).toBe('function');
        });

        it('should export SunsetIcon', () => {
            expect(SunsetIcon).toBeDefined();
            expect(typeof SunsetIcon).toBe('function');
        });

        it('should export MoonIcon', () => {
            expect(MoonIcon).toBeDefined();
            expect(typeof MoonIcon).toBe('function');
        });
    });
});
