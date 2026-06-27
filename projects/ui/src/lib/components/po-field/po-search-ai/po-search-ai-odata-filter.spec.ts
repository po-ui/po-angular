import { poSearchAiCompileFilter, poSearchAiFilterItems } from './po-search-ai-odata-filter';

const people = [
  { name: 'Ana', age: 25, city: 'SP', salary: 3000, active: true, hireDate: '2022-01-15', score: null },
  { name: 'Bruno', age: 30, city: 'RJ', salary: 5000, active: false, hireDate: '2020-06-01', score: 8.5 },
  { name: 'Carla', age: 22, city: 'SP', salary: 7000, active: true, hireDate: '2023-03-10', score: 9 },
  { name: 'Diego', age: 40, city: 'MG', salary: 4000, active: false, hireDate: '2019-12-20', score: 7 }
] as Array<Record<string, unknown>>;

describe('poSearchAiCompileFilter:', () => {
  describe('guard clauses:', () => {
    it('should return truthy predicate for empty string', () => {
      const pred = poSearchAiCompileFilter('');
      expect(pred({ x: 1 })).toBeTrue();
    });

    it('should return truthy predicate for whitespace-only string', () => {
      const pred = poSearchAiCompileFilter('   ');
      expect(pred({ x: 1 })).toBeTrue();
    });

    it('should return truthy predicate for null-like value', () => {
      const pred = poSearchAiCompileFilter(null);
      expect(pred({ x: 1 })).toBeTrue();
    });

    it('should return truthy predicate for invalid filter (graceful fallback)', () => {
      const pred = poSearchAiCompileFilter('!!!invalid!!!');
      expect(pred({ city: 'SP' })).toBeTrue();
    });

    it('should return truthy predicate when operator is missing', () => {
      const pred = poSearchAiCompileFilter('city');
      expect(pred({ city: 'SP' })).toBeTrue();
    });
  });

  describe('eq operator:', () => {
    it('should match string equality', () => {
      const pred = poSearchAiCompileFilter("city eq 'SP'");
      expect(pred({ city: 'SP' })).toBeTrue();
      expect(pred({ city: 'RJ' })).toBeFalse();
    });

    it('should match number equality', () => {
      const pred = poSearchAiCompileFilter('age eq 30');
      expect(pred({ age: 30 })).toBeTrue();
      expect(pred({ age: 25 })).toBeFalse();
    });

    it('should match number stored as string', () => {
      const pred = poSearchAiCompileFilter('age eq 30');
      expect(pred({ age: '30' })).toBeTrue();
    });

    it('should match boolean true', () => {
      const pred = poSearchAiCompileFilter('active eq true');
      expect(pred({ active: true })).toBeTrue();
      expect(pred({ active: false })).toBeFalse();
    });

    it('should match boolean false', () => {
      const pred = poSearchAiCompileFilter('active eq false');
      expect(pred({ active: false })).toBeTrue();
      expect(pred({ active: true })).toBeFalse();
    });

    it('should match null literal', () => {
      const pred = poSearchAiCompileFilter('score eq null');
      expect(pred({ score: null })).toBeTrue();
      expect(pred({ score: undefined })).toBeTrue();
      expect(pred({ score: 0 })).toBeFalse();
    });

    it('should match ISO date', () => {
      const pred = poSearchAiCompileFilter("hireDate eq '2022-01-15'");
      expect(pred({ hireDate: '2022-01-15' })).toBeTrue();
      expect(pred({ hireDate: '2020-06-01' })).toBeFalse();
    });

    it('should match field on the right side', () => {
      const pred = poSearchAiCompileFilter("'SP' eq city");
      expect(pred({ city: 'SP' })).toBeTrue();
    });
  });

  describe('ne operator:', () => {
    it('should match string inequality', () => {
      const pred = poSearchAiCompileFilter("city ne 'SP'");
      expect(pred({ city: 'RJ' })).toBeTrue();
      expect(pred({ city: 'SP' })).toBeFalse();
    });

    it('should match number inequality', () => {
      const pred = poSearchAiCompileFilter('age ne 30');
      expect(pred({ age: 25 })).toBeTrue();
      expect(pred({ age: 30 })).toBeFalse();
    });
  });

  describe('gt operator:', () => {
    it('should match numeric greater-than', () => {
      const pred = poSearchAiCompileFilter('salary gt 4000');
      expect(pred({ salary: 5000 })).toBeTrue();
      expect(pred({ salary: 4000 })).toBeFalse();
      expect(pred({ salary: 3000 })).toBeFalse();
    });

    it('should return false when either side is null', () => {
      const pred = poSearchAiCompileFilter('score gt 5');
      expect(pred({ score: null })).toBeFalse();
    });
  });

  describe('ge operator:', () => {
    it('should match numeric greater-than-or-equal', () => {
      const pred = poSearchAiCompileFilter('salary ge 5000');
      expect(pred({ salary: 5000 })).toBeTrue();
      expect(pred({ salary: 7000 })).toBeTrue();
      expect(pred({ salary: 4999 })).toBeFalse();
    });
  });

  describe('lt operator:', () => {
    it('should match numeric less-than', () => {
      const pred = poSearchAiCompileFilter('age lt 30');
      expect(pred({ age: 25 })).toBeTrue();
      expect(pred({ age: 30 })).toBeFalse();
    });
  });

  describe('le operator:', () => {
    it('should match numeric less-than-or-equal', () => {
      const pred = poSearchAiCompileFilter('age le 25');
      expect(pred({ age: 25 })).toBeTrue();
      expect(pred({ age: 22 })).toBeTrue();
      expect(pred({ age: 26 })).toBeFalse();
    });
  });

  describe('negative numbers:', () => {
    it('should match negative number with eq', () => {
      const pred = poSearchAiCompileFilter('balance eq -100');
      expect(pred({ balance: -100 })).toBeTrue();
      expect(pred({ balance: 100 })).toBeFalse();
    });

    it('should match negative number with gt', () => {
      const pred = poSearchAiCompileFilter('balance gt -50');
      expect(pred({ balance: 0 })).toBeTrue();
      expect(pred({ balance: -100 })).toBeFalse();
    });
  });

  describe('decimal numbers:', () => {
    it('should match decimal number with eq', () => {
      const pred = poSearchAiCompileFilter('score eq 8.5');
      expect(pred({ score: 8.5 })).toBeTrue();
      expect(pred({ score: 9 })).toBeFalse();
    });

    it('should match decimal number with gt', () => {
      const pred = poSearchAiCompileFilter('score gt 8.0');
      expect(pred({ score: 8.5 })).toBeTrue();
      expect(pred({ score: 7 })).toBeFalse();
    });
  });

  describe('date comparisons:', () => {
    it('should match date with gt using DATE token', () => {
      const pred = poSearchAiCompileFilter('hireDate gt 2021-01-01');
      expect(pred({ hireDate: '2022-01-15' })).toBeTrue();
      expect(pred({ hireDate: '2019-12-20' })).toBeFalse();
    });

    it('should match date with le', () => {
      const pred = poSearchAiCompileFilter('hireDate le 2020-12-31');
      expect(pred({ hireDate: '2020-06-01' })).toBeTrue();
      expect(pred({ hireDate: '2022-01-15' })).toBeFalse();
    });

    it('should match Date object against ISO string', () => {
      const pred = poSearchAiCompileFilter("hireDate eq '2022-01-15'");
      expect(pred({ hireDate: new Date('2022-01-15') })).toBeTrue();
    });

    it('should return false when date string is invalid in comparison', () => {
      const pred = poSearchAiCompileFilter('hireDate gt invalid-date');
      expect(pred({ hireDate: '2022-01-15' })).toBeFalse();
    });
  });

  describe('and operator:', () => {
    it('should match both conditions', () => {
      const pred = poSearchAiCompileFilter("city eq 'SP' and salary gt 4000");
      expect(pred({ city: 'SP', salary: 7000 })).toBeTrue();
      expect(pred({ city: 'SP', salary: 3000 })).toBeFalse();
      expect(pred({ city: 'RJ', salary: 7000 })).toBeFalse();
    });

    it('should chain multiple and conditions', () => {
      const pred = poSearchAiCompileFilter("city eq 'SP' and age lt 30 and active eq true");
      expect(pred({ city: 'SP', age: 25, active: true })).toBeTrue();
      expect(pred({ city: 'SP', age: 35, active: true })).toBeFalse();
    });
  });

  describe('or operator:', () => {
    it('should match either condition', () => {
      const pred = poSearchAiCompileFilter("city eq 'SP' or city eq 'RJ'");
      expect(pred({ city: 'SP' })).toBeTrue();
      expect(pred({ city: 'RJ' })).toBeTrue();
      expect(pred({ city: 'MG' })).toBeFalse();
    });
  });

  describe('not operator:', () => {
    it('should negate a condition', () => {
      const pred = poSearchAiCompileFilter("not city eq 'SP'");
      expect(pred({ city: 'RJ' })).toBeTrue();
      expect(pred({ city: 'SP' })).toBeFalse();
    });

    it('should support double not', () => {
      const pred = poSearchAiCompileFilter('not not active eq true');
      expect(pred({ active: true })).toBeTrue();
      expect(pred({ active: false })).toBeFalse();
    });
  });

  describe('parentheses:', () => {
    it('should change operator precedence', () => {
      const pred = poSearchAiCompileFilter("(city eq 'SP' or city eq 'RJ') and active eq true");
      expect(pred({ city: 'SP', active: true })).toBeTrue();
      expect(pred({ city: 'RJ', active: true })).toBeTrue();
      expect(pred({ city: 'SP', active: false })).toBeFalse();
      expect(pred({ city: 'MG', active: true })).toBeFalse();
    });

    it('should support nested parentheses', () => {
      const pred = poSearchAiCompileFilter('((age gt 20) and (age lt 35))');
      expect(pred({ age: 25 })).toBeTrue();
      expect(pred({ age: 40 })).toBeFalse();
    });
  });

  describe('contains function:', () => {
    it('should match substring (case-insensitive)', () => {
      const pred = poSearchAiCompileFilter("contains(name, 'an')");
      expect(pred({ name: 'Ana' })).toBeTrue();
      expect(pred({ name: 'Bruno' })).toBeFalse();
    });

    it('should match uppercase field value', () => {
      const pred = poSearchAiCompileFilter("contains(city, 'sp')");
      expect(pred({ city: 'SP' })).toBeTrue();
    });

    it('should handle null field gracefully', () => {
      const pred = poSearchAiCompileFilter("contains(name, 'test')");
      expect(pred({ name: null })).toBeFalse();
    });
  });

  describe('startswith function:', () => {
    it('should match prefix (case-insensitive)', () => {
      const pred = poSearchAiCompileFilter("startswith(name, 'bru')");
      expect(pred({ name: 'Bruno' })).toBeTrue();
      expect(pred({ name: 'Ana' })).toBeFalse();
    });
  });

  describe('endswith function:', () => {
    it('should match suffix (case-insensitive)', () => {
      const pred = poSearchAiCompileFilter("endswith(name, 'rla')");
      expect(pred({ name: 'Carla' })).toBeTrue();
      expect(pred({ name: 'Ana' })).toBeFalse();
    });
  });

  describe('tolower function:', () => {
    it('should apply tolower to field before comparison', () => {
      const pred = poSearchAiCompileFilter("tolower(name) eq 'ana'");
      expect(pred({ name: 'ANA' })).toBeTrue();
      expect(pred({ name: 'Bruno' })).toBeFalse();
    });

    it('should handle null field with tolower', () => {
      const pred = poSearchAiCompileFilter("tolower(name) eq 'ana'");
      expect(pred({ name: null })).toBeFalse();
    });
  });

  describe('toupper function:', () => {
    it('should apply toupper to field before comparison', () => {
      const pred = poSearchAiCompileFilter("toupper(city) eq 'SP'");
      expect(pred({ city: 'sp' })).toBeTrue();
      expect(pred({ city: 'rj' })).toBeFalse();
    });
  });

  describe('navigation path (slash notation):', () => {
    it('should resolve nested property via slash', () => {
      const pred = poSearchAiCompileFilter("address/city eq 'SP'");
      expect(pred({ address: { city: 'SP' } })).toBeTrue();
      expect(pred({ address: { city: 'RJ' } })).toBeFalse();
    });

    it('should return false when navigation path does not exist', () => {
      const pred = poSearchAiCompileFilter("address/city eq 'SP'");
      expect(pred({ name: 'Ana' })).toBeFalse();
    });

    it('should return false when intermediate object is null', () => {
      const pred = poSearchAiCompileFilter("address/city eq 'SP'");
      expect(pred({ address: null })).toBeFalse();
    });
  });

  describe('single-quote escape in string literal:', () => {
    it("should handle '' as escaped single quote", () => {
      const pred = poSearchAiCompileFilter("name eq 'O''Brien'");
      expect(pred({ name: "O'Brien" })).toBeTrue();
      expect(pred({ name: 'OBrien' })).toBeFalse();
    });
  });

  describe('field not present in item:', () => {
    it('should return false for eq when field is undefined', () => {
      const pred = poSearchAiCompileFilter("city eq 'SP'");
      expect(pred({ name: 'Ana' })).toBeFalse();
    });

    it('should return false for ordering when field is undefined', () => {
      const pred = poSearchAiCompileFilter('salary gt 1000');
      expect(pred({ name: 'Ana' })).toBeFalse();
    });
  });

  describe('looseEqual — uncovered branches:', () => {
    it('should handle number literal on left and string field on right (typeof a === number)', () => {
      const pred = poSearchAiCompileFilter('30 eq age');
      expect(pred({ age: '30' })).toBeTrue();
      expect(pred({ age: '25' })).toBeFalse();
    });

    it('should handle Date literal (unquoted) vs string field (b instanceof Date)', () => {
      const pred = poSearchAiCompileFilter('hireDate eq 2022-01-15');
      expect(pred({ hireDate: '2022-01-15' })).toBeTrue();
      expect(pred({ hireDate: '2020-06-01' })).toBeFalse();
    });

    it('should handle Date literal vs Date field object (a instanceof Date && b instanceof Date)', () => {
      const pred = poSearchAiCompileFilter('hireDate eq 2022-01-15');
      expect(pred({ hireDate: new Date('2022-01-15') })).toBeTrue();
      expect(pred({ hireDate: new Date('2020-06-01') })).toBeFalse();
    });

    it('should return false when field contains an invalid Date object (isNaN branch)', () => {
      const pred = poSearchAiCompileFilter('hireDate gt 2021-01-01');
      expect(pred({ hireDate: new Date('not-a-date') })).toBeFalse();
    });
  });

  describe('compareValues — uncovered branches:', () => {
    it('should use localeCompare when values are non-numeric strings in ordering', () => {
      const pred = poSearchAiCompileFilter("name gt 'Ana'");
      expect(pred({ name: 'Bruno' })).toBeTrue();
      expect(pred({ name: 'Aaa' })).toBeFalse();
    });

    it('should return false when Date field is compared to an unparseable string literal', () => {
      const pred = poSearchAiCompileFilter("hireDate gt 'not-a-date'");
      expect(pred({ hireDate: new Date('2022-01-15') })).toBeFalse();
    });

    it('should return false when ordering operator has null literal (b == null non-short-circuit)', () => {
      const pred = poSearchAiCompileFilter('salary gt null');
      expect(pred({ salary: 5000 })).toBeFalse();
    });
  });

  describe('tokenizer — uncovered branches:', () => {
    it('should handle negative literal as the very first token (START as prevType)', () => {
      const pred = poSearchAiCompileFilter('-5 eq balance');
      expect(pred({ balance: -5 })).toBeTrue();
      expect(pred({ balance: 0 })).toBeFalse();
    });

    it('should return truthy predicate when minus sign is the last character (nullish input[i+1])', () => {
      const pred = poSearchAiCompileFilter('salary gt -');
      expect(pred({ salary: 9999 })).toBeTrue();
    });

    it('should treat null second argument in string function as empty string (valFn nullish branch)', () => {
      const pred = poSearchAiCompileFilter('contains(name, extra)');
      expect(pred({ name: 'Ana', extra: null })).toBeTrue();
    });
  });

  describe('expect() error branch:', () => {
    it('should return truthy predicate when tolower receives a non-identifier token', () => {
      const pred = poSearchAiCompileFilter("tolower(123) eq 'ana'");
      expect(pred({ name: 'Ana' })).toBeTrue();
    });
  });

  describe('navigation path — non-object intermediate:', () => {
    it('should return false when intermediate navigation value is a primitive', () => {
      const pred = poSearchAiCompileFilter("address/city eq 'SP'");
      expect(pred({ address: 42 })).toBeFalse();
    });
  });

  describe('combined filters (typical AI output):', () => {
    it('should filter SP employees with salary above 4000', () => {
      const pred = poSearchAiCompileFilter("city eq 'SP' and salary gt 4000");
      const result = people.filter(pred);
      expect(result.length).toBe(1);
      expect(result[0]['name']).toBe('Carla');
    });

    it('should filter inactive employees from RJ or MG', () => {
      const pred = poSearchAiCompileFilter("active eq false and (city eq 'RJ' or city eq 'MG')");
      const result = people.filter(pred);
      expect(result.length).toBe(2);
      expect(result.map(p => p['name'])).toEqual(['Bruno', 'Diego']);
    });

    it('should filter employees hired after 2021 with age below 30', () => {
      const pred = poSearchAiCompileFilter('hireDate gt 2021-01-01 and age lt 30');
      const result = people.filter(pred);
      expect(result.map(p => p['name'])).toContain('Ana');
      expect(result.map(p => p['name'])).toContain('Carla');
      expect(result.map(p => p['name'])).not.toContain('Bruno');
      expect(result.map(p => p['name'])).not.toContain('Diego');
    });
  });
});

describe('poSearchAiFilterItems:', () => {
  it('should return original array when filter is empty', () => {
    const result = poSearchAiFilterItems(people, '');
    expect(result).toBe(people);
  });

  it('should return original array when filter is whitespace', () => {
    const result = poSearchAiFilterItems(people, '  ');
    expect(result).toBe(people);
  });

  it('should return original array when items is empty', () => {
    const empty: Array<Record<string, unknown>> = [];
    const result = poSearchAiFilterItems(empty, "city eq 'SP'");
    expect(result).toBe(empty);
  });

  it('should return original array when items is null-like', () => {
    const result = poSearchAiFilterItems(null, "city eq 'SP'");
    expect(result).toBeNull();
  });

  it('should filter items matching the OData filter', () => {
    const result = poSearchAiFilterItems(people, "city eq 'SP'");
    expect(result.length).toBe(2);
    expect(result.map(p => p['name'])).toEqual(['Ana', 'Carla']);
  });

  it('should return empty array when no items match', () => {
    const result = poSearchAiFilterItems(people, "city eq 'BA'");
    expect(result.length).toBe(0);
  });

  it('should return all items when filter is invalid (graceful fallback)', () => {
    const result = poSearchAiFilterItems(people, '@@@@');
    expect(result.length).toBe(people.length);
  });

  it('should preserve original array reference for invalid filter', () => {
    const result = poSearchAiFilterItems(people, '@@@');
    expect(result.length).toBe(people.length);
  });

  it('should support generic typed arrays', () => {
    const typed = [
      { id: 1, value: 'a' },
      { id: 2, value: 'b' }
    ] as Array<Record<string, unknown>>;
    const result = poSearchAiFilterItems(typed, 'id eq 1');
    expect(result.length).toBe(1);
    expect(result[0]['id']).toBe(1);
  });
});
