$.get("constituencies.tsv", function (constituencyData) {
  $.get("MPs.tsv", function (mpData) {
    var lines = constituencyData.split("\n")
    var constituencies = {};
    var constituencyCodes = {};
    for (i in lines) {
      name = lines[i].split("\t")[0];
      code = lines[i].split("\t")[1];
      constituencies[name] = code
      constituencyCodes[code] = { "name": name }
    }

    var constituencyLookup = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: Object.keys(constituencies)
    });

    var lines = mpData.split("\n")
    var mps = {}
    for (i in lines) {
      name = lines[i].split("\t")[0];
      code = lines[i].split("\t")[1];
      mps[name] = code;
      constituencyCodes[code]["mp"] = name;
    }

    var mpLookup = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: Object.keys(mps)
    });

    $('#constituency').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'constituency',
      source: constituencyLookup,
      templates: {
        header: '<h3 class="search-type">Constituencies</h3>'
      }
    },
    {
      name: 'mps',
      source: mpLookup,
      templates: {
        header: '<h3 class="search-type">MPs</h3>'
      }
    });

    $("#search").submit(function (event) {
      $('#constituency').typeahead('close');
      var search = $('#constituency').typeahead('val');
      var code = constituencies[search];
      if (code == undefined) {
        code = mps[search];
      }
      window.location.hash = '#' + code;
      loadData(code);
      return false;
    });

    var loadData = function(code) {
      showConstituency(code);
      showPopulation(code);
    };

    var showConstituency = function(code) {
      var constituency = constituencyCodes[code];
      $('#constituencyName').text(constituency["mp"] + ": MP for " + constituency["name"]);
    };

    var showPopulation = function(code) {
      $("#population").hide();
      loadONSstats("KS101EW", 1, code, function (data) {
        var population = data["All categories: Sex"];
        $("#population .value").text(population);
        $("#population").show();
      });
    };

    var loadONSstats = function(dataset, segmentNo, area, callback) {
      $.get("http://www.ons.gov.uk/ons/api/data/dataset/" + dataset + ".json?context=Census&jsontype=json-stat&apikey=sqZtbN6sgJ&geog=2011PCONH&totals=false&dm/2011PCONH=" + area, function (data) {
        var segmentId = dataset + " Segment_" + segmentNo;
        var segment = data[segmentId];
        var values = segment["value"];
        var dimension = "";
        for (i in segment["dimension"]["size"]) {
          if (segment["dimension"]["size"][i] > 1) {
            dimension = segment["dimension"][segment["dimension"]["id"][i]];
          }
        }
        var response = {};
        var labels = dimension["category"]["label"];
        var indexes = dimension["category"]["index"];
        for (c in labels) {
          response[labels[c]] = values[indexes[c]]
        }
        callback(response);
      });
    };

    var code = window.location.hash.substr(1);

    if (code !== '') {
      loadData(code);
      $('#constituency').attr("placeholder", constituencyCodes[code]["name"])
    }

  });
});
