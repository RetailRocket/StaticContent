/* global retailrocket*/
!(function ()
{
    'use strict';

    describe('Module Tests',
        function ()
        {
            beforeEach(function ()
            {});

            it('Module Is Defined',
                function ()
                {
                    expect(retailrocket).toBeDefined();
                    expect(retailrocket.setModule).toBeDefined();
                });

            it('Module Allows Define Modules And They Are Ready To Work If They Are Global', function ()
            {
                retailrocket.setModule('test' + (new Date()).getTime(),
                    [],
                    function ()
                    {
                        var t = 'test';
                        return {
                            getter: function ()
                            {
                                return t;
                            },
                            useNs: true
                        };
                    },
                    true
                );

                expect(retailrocket.test).toBeDefined();
                expect(retailrocket.test.getter()).toEqual('test');
            });

            it('Module Injects Dependencies Which Are Not Global', function ()
            {
                var d = new Date();

                var dependencyName = 'dependency' + (new Date()).getTime();
                var globalDependentName = 'globalDependent' + (new Date()).getTime();

                retailrocket.setModule(dependencyName,
                    [],
                    function ()
                    {
                        return {
                            getter: function ()
                            {
                                return d;
                            }
                        };
                    }
                );

                retailrocket.setModule(globalDependentName,
                    [dependencyName],
                    function (dependency)
                    {
                        return {
                            expectation: dependency.getter(),
                            useNs: true
                        };
                    },
                    true
                );

                expect(retailrocket.globalDependent.expectation).toEqual(d);
            });

            it('Local Module Is Intialize Only If It Inject', function ()
            {
                var dependencyName = 'dependency' + (new Date()).getTime();
                var dependentName = 'dependent' + (new Date()).getTime();

                expect(function ()
                {
                    retailrocket.setModule(dependencyName,
                        [],
                        function ()
                        {
                            throw new Error();
                        });
                }).not.toThrow();

                expect(function ()
                {
                    retailrocket.setModule(dependentName, [dependencyName],
                        function ()
                        {
                            return {
                                useNs: true
                            };
                        },
                        true
                    );
                }).toThrow();
            });

            it('Module Throw Exception If Dependency Is Not Defined', function ()
            {
                var undefinedDependency = 'dependency' + (new Date()).getTime();
                var dependentName = 'dependent' + (new Date()).getTime();

                expect(function ()
                {
                    retailrocket.setModule(dependentName, [undefinedDependency],
                        function ()
                        {
                            return {
                                useNs: true
                            };
                        },
                        true
                    );
                }).toThrow();
            });
        });
}());

