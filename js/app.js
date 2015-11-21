$.get("constituencies.tsv", function (constituencyData) {
  $.get("MPs.tsv", function (mpData) {
    var lines = constituencyData.split("\n")
    var constituencies = {}
    for (i in lines) {
      constituencies[lines[i].split("\t")[0]] = lines[i].split("\t")[1]
    }

    var constituencyLookup = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: Object.keys(constituencies)
    });

    var lines = mpData.split("\n")
    var mps = {}
    for (i in lines) {
      mps[lines[i].split("\t")[0]] = lines[i].split("\t")[1]
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
      return false;
    });
  });
});
