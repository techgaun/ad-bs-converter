var should = require('chai').should(),
    adbsconverter = require('../../src/converter.js'),
    bs2ad = adbsconverter.bs2ad,
    ad2bs = adbsconverter.ad2bs;

describe('#bs2ad', function() {
    it('Converts 2072/4/3 to 2015/7/19', function() {
        bs2ad('2072/4/3').should.equal('2015/7/19');
    });

    it('Converts 2072/4/16 to 2015/8/1', function() {
        bs2ad('2072/4/16').should.equal('2015/8/1');
    });

    it('Converts 2070/9/17 to 2014/1/1', function() {
        bs2ad('2070/9/17').should.equal('2014/1/1');
    });

    it('Converts 2072/4/1 to 2015/7/17', function() {
        bs2ad('2072/4/1').should.equal('2015/7/17');
    });

    it('Converts 1970/4/1 to 1913/7/16', function() {
        bs2ad('1978/1/1').should.equal('1921/4/13');
    });

    it('Converts 2092/12/30 to 2036/4/14', function() {
        bs2ad('2092/12/30').should.equal('2036/4/14');
    });

    //my birthday :D
    it('Converts 2047/4/26 to 1990/8/10', function() {
        bs2ad('2047/4/26').should.equal('1990/8/10');
    });
});

describe('#ad2bs', function() {
    it('Converts 2015/8/1 to 2072/4/16', function() {
        ad2bs('2015/8/1').should.equal('2072/4/16');
    });

    it('Converts 2014/1/1 to 2070/9/17', function() {
        ad2bs('2014/1/1').should.equal('2070/9/17');
    });

    it('Converts 2015/7/19 to 2072/4/3', function() {
        ad2bs('2015/7/19').should.equal('2072/4/3');
    });

    it('Converts 2015/7/17 to 2072/4/1', function() {
        ad2bs('2015/7/17').should.equal('2072/4/1');
    });

    it('Converts 2017/4/13 to 2073/12/31', function() {
        ad2bs('2017/4/13').should.equal('2073/12/31');
    });

    it('Converts 2018/4/13 to 2074/12/30', function() {
        ad2bs('2018/4/13').should.equal('2074/12/30');
    });

    it('Converts 2036/4/14 to 2092/12/30', function() {
        ad2bs('2036/4/14').should.equal('2092/12/30');
    });

    //my birthday :D
    it('Converts 1990/8/10 to 2047/4/26', function() {
        ad2bs('1990/8/10').should.equal('2047/4/26');
    });
});

// below needs some changes
//describe('#ad2bs get day of week', function() {
//   it('Converts 2015/8/1 to Saturday', function() {
//       getWeek(ad2bs('2015/8/1'), 'ne').should.equal('Saturday')
//   });
//});
//
//describe('#bs2ad get day of week', function() {
//    it('Converts 2015/8/1 to Saturday', function() {
//        getWeek(ad2bs('2072/4/16'), 'en').should.equal('Saturday')
//    });
//});
